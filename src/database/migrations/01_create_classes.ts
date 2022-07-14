//armazena as aulas
import knex from 'knex'

export async function up(knex: knex){
    return knex.schema.createTable('classes', table =>{
        //cria a tabela
        table.increments('id').primary()
        table.string('subject').notNullable();
        table.decimal('cost').notNullable()

        //relacionamento pq precisa de um prof user pra dar aula
        table.integer('user_id')
            .notNullable()// sempre recebe um valor
            .references('id')// campo de referencia
            .inTable('users')//em qual tabela
            .onUpdate('CASCADE')// qnd o id é alterado ele apaga os dados
            .onDelete('CASCADE')//caso o usuario seja deletado
    })
}

export async function down(knex:knex){
    return knex.schema.dropTable('classes')
}