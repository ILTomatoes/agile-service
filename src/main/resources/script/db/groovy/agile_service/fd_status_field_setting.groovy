package script.db.groovy.agile_service

databaseChangeLog(logicalFilePath: 'fd_status_field_setting.groovy') {
    changeSet(author: 'ztxemail@163.com', id: '2020-08-13-create-table-status-field-setting') {
        createTable(tableName: 'fd_status_field_setting') {
            column(name: 'id', type: 'BIGINT UNSIGNED', autoIncrement: 'true', remarks: 'ID,主键') {
                constraints(primaryKey: true)
            }
            column(name: 'issue_type_id', type: 'BIGINT UNSIGNED', remarks: '问题类型Id') {
                constraints(nullable: false)
            }
            column(name: 'project_id', type: 'BIGINT UNSIGNED', remarks: '项目id') {
                constraints(nullable: false)
            }
            column(name: 'status_id', type: 'BIGINT UNSIGNED', remarks: '状态Id') {
                constraints(nullable: false)
            }
            column(name: 'field_id', type: 'BIGINT UNSIGNED', remarks: '字段Id')

            column(name: "object_version_number", type: "BIGINT UNSIGNED", defaultValue: "1")
            column(name: "created_by", type: "BIGINT UNSIGNED", defaultValue: "0")
            column(name: "creation_date", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP")
            column(name: "last_updated_by", type: "BIGINT UNSIGNED", defaultValue: "0")
            column(name: "last_update_date", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP")
        }
    }

    changeSet(author: 'ztxemail@163.com',id: '2020-09-14-fd-status-field-setting-add-index'){
        createIndex(indexName: "idx_issue_type_id", tableName: "fd_status_field_setting") {
            column(name: "issue_type_id")
        }
        createIndex(indexName: "idx_project_id", tableName: "fd_status_field_setting") {
            column(name: "project_id")
        }
        createIndex(indexName: "idx_status_id", tableName: "fd_status_field_setting") {
            column(name: "status_id")
        }
    }
}