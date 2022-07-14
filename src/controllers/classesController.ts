
//importo pra as variaveis req e res serem inxergadas
import {Request, Response, response} from 'express'


import db from '../database/connection';
import convertHourstoMinute from '../utils/convertHoursToMinutes';
import Knex from 'knex';


//serve pra poder ter acesso as variaveis de dentro do schedule
interface scheduleItem {

    week_day: number,
    from: String,
    to: String

}


// exporto uma classe, que vai gerenciar os inserts da aplicação e a filtragem de aulas
class ClassController{


    //#region criação de aula

        async create(req:Request, res: Response) {
        
        
            console.log('acessou a rota');
        
        
            
            
        
            //desestruturo tudo o que vem do body que vai ser usado
            const {
        
                name,
                avatar,
                whatsapp,
                bio,
                subject,
                cost,
                schedule
        
            } = req.body
        

            //caso algum schema de errado o resto vai continuar salvo, entao a gente precisa que qnd de algum erro não cadastre o resto dos dados desse constexto        
            //trx = TRanseXion, verifica se tem algum erro pra depois salvar
            const trx = await db.transaction()
        
            try {
        
        
                // insere os dados no sqlite na tabela users
                const insertedUsersId = await trx('users').insert({
        
                    name,
                    avatar,
                    whatsapp,
                    bio,
        
                })

                // criar  um array salvando id  do usuario
                const user_id = insertedUsersId[0] 
        
                // insere os dados no sqlite na tabela classes
                const insirtedClassesId =  await trx('classes').insert({
        
                    subject,
                    cost,
                    user_id,
        
                })
        
                // salva a classe e adiciona um id de acordo com a posição
                const class_id = insirtedClassesId[0]
        
                // o banco de dados não aceita valor hora, estao temos que tranformar em minutos
                const classSchedule = schedule.map((scheduleItem: scheduleItem) =>{
        
                    return{
        
                        class_id,
                        week_day: scheduleItem.week_day,
                        from: convertHourstoMinute(scheduleItem.from),
                        to: convertHourstoMinute(scheduleItem.to)
        
                    }
        
                })

                //insere os dados do schedule no sqlite
                await trx('class_schedule').insert(classSchedule)
        
                // depois de ver se tem algum erro ai sim sava no sqlite
                await trx.commit()
        
        
        
                return res.status(201).send()
        
        
        
            } catch (error) {
        
                console.log(error)
        
                //disfaz todas as alterações feitas no meio da execução
                await trx.rollback()
        
                return res.status(400).json({

                    error: 'Unexpected erro while creating new class'

                })
        
            }
        
        }

    //#endregion 

    //#region filtrar Buscar
    
        async index(req:Request, res:Response){

            const filters = req.query


            const week_day = filters.week_day as string
            const subject = filters.subject as string
            const time = filters.time as string


            //verifica se todos os dados entao completos
            if (!filters.week_day || !filters.subject || !filters.time) {
                return res.status(400).json({
                    error: 'missing filters to seach classes'
                })
            }


            //como a função tranforma minutos em segundo ele em segundos e acha no bancp 
            const timeInMinutes = convertHourstoMinute(time)


            console.log(timeInMinutes);

            
            //cria uma variavel pra fazer os dados da pesquisa
            const classes = await db('classes')

                //#region section coments
                    //fazer um subquery pra ver se existe um horairo agendado
                // .whereExists(function(){
                //     //vai buscar no banco todos os agendamendo que tem o class_id igual ao que foi passadoi nos parametros
                //     //fazemdo um selct do zero
                //     this.select('class_schedule.*')
                //         .from('class_schedule')
                //         //quando usa whereExist essa é a mlhor dorma de fazer um where
                //         //       ('`coluna`,`tabela` for igual a `outra tabela`.`outra coluna`')
                //         .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                //         //vai buscar os dias da semana se foram iguais ao que foi passado no filtro
                //         //?? serve pra qmd voce for passar um parametro
                //         .whereRaw('`class_schedule`.`week_day` = ??',[Number(week_day)])
                //         .whereRaw('`class_schedule`.`from` <= ??',[timeInMinutes])
                //         .whereRaw('`class_schedule`.`to` > ??',[timeInMinutes])
                // })
                //#endregion
                
                //cronograma
                .whereExists(function(){

                    this.select('class_schedule.*')

                        .from('class_schedule')
                        .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                        .whereRaw('`class_schedule`.`week_day` = ??',[Number(week_day)])
                        .whereRaw('`class_schedule`.`from` <= ??',[timeInMinutes])
                        .whereRaw('`class_schedule`.`to` > ??',[timeInMinutes])
                
                })

                //#region section coments
                // .whereExists(function(){
                //     //vai buscar no banco todos os agendamendo que tem o class_id igual ao que foi passadoi nos parametros
                //     //fazemdo um selct do zero
                //     this.select('class_schedule.*')
                //         .from('class_schedule')
                //         //quando usa whereExist essa é a mlhor dorma de fazer um where
                //         //       ('`coluna`,`tabela` for igual a `outra tabela`.`outra coluna`')
                //         .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                //         //vai buscar os dias da semana se foram iguais ao que foi passado no filtro
                //         //?? serve pra qmd voce for passar um parametro
                //         .whereRaw('`class_schedule`.`week_day` = ??',[Number(week_day)])
                // })

                // // busca no banco e envia pra variavel
                // .where('classes.subject', '=', subject)

                // //busca na tabela user onde o id do usuario na tbalea classes seja iqual ao id da tabela user
                // .join('users', 'classes.user_id', '=','users.id')

                // //busca todos os dados das tabelas informadas
                // .select('classes.*', 'users.*')
                //#endregion
                
                //dia da semana
                .whereExists(function(){

                    this.select('class_schedule.*')

                        .from('class_schedule')
                        .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                        .whereRaw('`class_schedule`.`week_day` = ??',[Number(week_day)])

                })

                //materia
                .where('classes.subject', '=', subject)
                //junta tudo
                .join('users', 'classes.user_id', '=','users.id')
                .select('classes.*', 'users.*')


            return res.json(classes)
        }

    //#endregion 

    //#region show all

        async ListClasses(req: Request, res:Response){

            const response = await db('classes')
            
                .join('users', 'classes.user_id', '=','users.id')
                .select('classes.*', 'users.*')
            
            return res.json(response)
        }

    //#endregion

    
}

export default ClassController;
