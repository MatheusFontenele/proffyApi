import {Request, Response, response} from 'express'
import db from '../database/connection';

class ConnectionsControler{

    async index(req: Request, res:Response){
        const totalConnections =  await db('connections').count('* as total')

        const {total} = totalConnections[0]// 0 pq vai retonar sempre varios dados e so quermos o 1
        return res.json({total})
    }

    async create(req: Request, res:Response){
        const {user_id} = req.body;

        //insere o id do usuario no campo id do cenctions
        await db('connections').insert({
            user_id,
        })

        return res.status(201).send()
    }
    
}

export default ConnectionsControler
