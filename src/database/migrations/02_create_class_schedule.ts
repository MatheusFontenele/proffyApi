//armazena as aulas schedule = cronograma
import knex from 'knex'

export async function up(knex: knex){
    return knex.schema.createTable('class_schedule', table =>{
        //cria a tabela
        table.increments('id').primary()

        table.integer('week_day').notNullable()
        table.integer('from').notNullable()
        table.integer('to').notNullable()

        //relacionamento pq precisa de um prof user pra dar aula
        table.integer('class_id')
            .notNullable()// sempre recebe um valor
            .references('id')// campo de referencia
            .inTable('classes')//em qual tabela
            .onUpdate('CASCADE')// qnd o id é alterado ele apaga os dados
            .onDelete('CASCADE')//caso o usuario seja deletado
    })
}

export async function down(knex:knex){
    return knex.schema.dropTable('class_schedule')
}