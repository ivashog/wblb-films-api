import { BeforeInsert, BeforeUpdate, Column, Index } from 'typeorm';
import { IsBoolean, IsDate, IsEmail, IsMobilePhone, IsOptional, IsString, Length, Max } from 'class-validator';
import { Exclude } from 'class-transformer';
import { random } from 'faker';
import * as bcrypt from 'bcrypt';

import { BaseUuidEntity } from './base-uuid.entity';

export abstract class BaseUserEntity extends BaseUuidEntity {
    @Column()
    @Index({ unique: true })
    @IsEmail()
    email: string;

    @Column()
    @IsString()
    @Length(6, 200)
    @Exclude()
    private password: string;

    /** Salt for hashing password. Used for better security. */
    @Column()
    @Exclude()
    private salt: string;

    @Column({ length: 50 })
    @Index({ unique: true })
    @Max(50)
    @IsOptional()
    login?: string;

    @Column({ nullable: true })
    @IsMobilePhone('uk-UA')
    @IsOptional()
    phone?: string;

    /** Did user confirm his account */
    @Column({ default: false })
    @IsBoolean()
    isVerified: boolean;

    /** Can be used to confirm user, reset password, etc... */
    @Column({ nullable: true })
    @Exclude()
    secureToken?: string;

    /** Time when secureToken was created. Server decides token duration */
    @Column({ nullable: true, precision: 3 })
    @Exclude()
    tokenCreatedAt?: Date;

    /** Time when user last logged to system. */
    @Column({ nullable: true, precision: 3 })
    @IsDate()
    @IsOptional()
    lastLoginAt?: Date;

    @BeforeInsert()
    @BeforeUpdate()
    upsertLogin() {
        this.fillDefaultLogin();
    }

    /**
     * Set new password and hash it.
     * Use this method on user entity for set password
     */
    public async setPassword(newPassword: string) {
        this.salt = this.salt ? this.salt : await bcrypt.genSalt();
        this.password = await bcrypt.hash(newPassword, this.salt);

        return this;
    }

    /** Check if provided password is valid */
    public async checkPassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }

    /** Generate secure token to be used for password reset... */
    public generateSecureToken(): string {
        this.secureToken = random.uuid();
        this.tokenCreatedAt = new Date();
        return this.secureToken;
    }

    /** Call this method after token is used */
    public removeSecureToken(): void {
        this.secureToken = null;
        this.tokenCreatedAt = null;
    }

    /** Check if provided token is valid */
    public validToken(token: string): boolean {
        if (!this.secureToken || !this.tokenCreatedAt) {
            return false;
        }
        return this.secureToken === token;
    }

    /** Fill default user login as his email login. */
    private fillDefaultLogin(): void {
        if (!this.login) {
            this.login = this.email.split('@')[0];
        }
    }
}
