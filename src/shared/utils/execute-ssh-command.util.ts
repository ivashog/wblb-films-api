import { Client } from 'ssh2';
import { Logger } from '@nestjs/common';

// tslint:disable-next-line:class-name
export interface sshConnectionOptions {
    /** Hostname or IP address of the server. */
    host: string;
    /** Port number of the server. */
    port?: number;
    /** Username for authentication. */
    username: string;
    /** Password for password-based user authentication. */
    password: string;
    /** Buffer or string that contains a private key for either key-based or hostbased user authentication (OpenSSH format). */
    privateKey?: Buffer | string;
}

export async function executeOverSsh(
    cmd: string,
    options: sshConnectionOptions,
): Promise<{ stdout: string; stderr: string }> {
    return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
        const conn = new Client();
        conn.on('ready', () => {
            let stdout = '';
            let stderr = '';
            conn.exec(cmd, (err, stream) => {
                if (err) {
                    reject(err);
                }
                Logger.verbose('SSH command running...', 'executeOverSsh');

                stream
                    .on('close', (code, signal) => {
                        Logger.verbose(`Command finished with code ${code}`, 'executeOverSsh');
                        resolve({ stdout, stderr });
                        conn.end();
                    })
                    .on('data', data => {
                        console.log('>> ', data.toString().slice(0, -1));
                        stdout += data.toString();
                    })
                    .stderr.on('data', data => {
                        Logger.error(data.toString(), 'executeOverSsh');
                        stderr += data.toString();
                    });
            });
        }).connect(options);
    });
}
