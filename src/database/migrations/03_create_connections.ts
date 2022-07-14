//armazena as aulas
import knex from 'knex'

export async function up(knex: knex){
    return knex.schema.createTable('connections', table =>{

        table.increments('id').primary()
        
        //relacionamento pq precisa de um prof user pra dar aula
        table.integer('user_id')
            .notNullable()// sempre recebe um valor
            .references('id')// campo de referencia
            .inTable('users')//em qual tabela
            .onUpdate('CASCADE')// qnd o id é alterado ele apaga os dados
            .onDelete('CASCADE');//caso o usuario seja deletado
        //captura a data que houve a conexão
        table.timestamp('created_at')
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            .notNullable();

    })
}

export async function down(knex:knex){

    return knex.schema.dropTable('connections')
    
}