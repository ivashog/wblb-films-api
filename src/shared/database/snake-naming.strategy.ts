import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class SnakeNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    tableName(className: string, userSpecifiedName: string): string {
        return userSpecifiedName ? userSpecifiedName : snakeCase(className.replace(/entity$/i, ''));
    }

    columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
        return snakeCase(embeddedPrefixes.join('_')) + (customName ? customName : snakeCase(propertyName));
    }

    relationName(propertyName: string): string {
        return snakeCase(propertyName);
    }

    primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
        // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
        const clonedColumnNames = [...columnNames];
        clonedColumnNames.sort();
        const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;
        const replacedTableName = this.replaceTableName(tableName);
        const key = `${replacedTableName}__${clonedColumnNames.join('_')}`;
        return 'PK_' + key.toUpperCase();
    }

    foreignKeyName(
        tableOrName: Table | string,
        columnNames: string[],
        referencedTablePath?: string,
        referencedColumnNames?: string[],
    ): string {
        // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
        const clonedColumnNames = [...columnNames];
        const clonedReferencedColumnNames = [...referencedColumnNames];
        clonedColumnNames.sort();
        const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;
        const replacedTableName = this.replaceTableName(tableName);
        const referencedTableName = this.replaceTableName(referencedTablePath);
        const tableKey = `${replacedTableName}__${clonedColumnNames.join('_')}`;
        const referencedTableKey = `${referencedTableName}__${clonedReferencedColumnNames.join('_')}`;
        const key = `${tableKey}__${referencedTableKey}`;
        return 'FK_' + key.toUpperCase();
    }

    indexName(tableOrName: Table | string, columnNames: string[], where?: string): string {
        // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
        const clonedColumnNames = [...columnNames];
        clonedColumnNames.sort();
        const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;
        const replacedTableName = this.replaceTableName(tableName);
        let key = `${replacedTableName}__${clonedColumnNames.join('_')}`;
        if (where) {
            key += `_${where}`;
        }

        return 'IDX_' + key.toUpperCase();
    }

    relationConstraintName(tableOrName: Table | string, columnNames: string[], where?: string): string {
        // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
        const clonedColumnNames = [...columnNames];
        clonedColumnNames.sort();
        const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;
        const replacedTableName = this.replaceTableName(tableName);
        let key = `${replacedTableName}_${clonedColumnNames.join('_')}`;
        if (where) {
            key += `_${where}`;
        }

        return 'REL_' + key.toUpperCase();
    }

    uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
        // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
        const clonedColumnNames = [...columnNames];
        clonedColumnNames.sort();
        const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;
        const replacedTableName = this.replaceTableName(tableName);
        const key = `${replacedTableName}_${clonedColumnNames.join('_')}`;
        return 'UQ_' + key.toUpperCase();
    }

    checkConstraintName(tableOrName: Table | string, expression: string): string {
        const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;
        const replacedTableName = this.replaceTableName(tableName);
        const key = `${replacedTableName}__${expression}`;
        return 'CHK_' + key.toUpperCase();
    }

    joinColumnName(relationName: string, referencedColumnName: string): string {
        return snakeCase(relationName + '_' + referencedColumnName);
    }

    joinTableName(
        firstTableName: string,
        secondTableName: string,
        firstPropertyName: string,
        secondPropertyName: string,
    ): string {
        return snakeCase(firstTableName + '_' + firstPropertyName.replace(/\./gi, '_') + '_' + secondTableName);
    }

    joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
        return snakeCase(tableName + '_' + (columnName ? columnName : propertyName));
    }

    classTableInheritanceParentColumnName(parentTableName: any, parentTableIdPropertyName: any): string {
        return snakeCase(parentTableName + '_' + parentTableIdPropertyName);
    }

    eagerJoinRelationAlias(alias: string, propertyPath: string): string {
        return alias + '__' + propertyPath.replace('.', '_');
    }

    private replaceTableName(tableName: string): string {
        return tableName.replace(/^\w+./, '').replace('.', '_');
    }
}
