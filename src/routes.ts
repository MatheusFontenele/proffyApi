import express from 'express'
import ClassController from './controllers/classesController';
import ConnectionsControler from './controllers/connectionController';

const routes = express.Router()

const classController = new ClassController
const connectionsController = new ConnectionsControler

routes.post('/classes', classController.create)
routes.get('/classes', classController.index)
routes.get('/classesList', classController.ListClasses)


routes.post('/connections', connectionsController.create)
routes.get('/connections', connectionsController.index)

export default routes;