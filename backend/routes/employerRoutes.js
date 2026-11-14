import express from 'express';
import { authenticationUser } from '../auth/auth.js';
import {addCompany,updateCompany,getEmployerCompany,getAllCompany, deleteCompany} from '../controller/employerController.js'
import { validateAddEmployer,validateUpdateEmployer } from '../services/dataValidator.js';

const employerRoutes = express.Router();

employerRoutes.get('/get-all-company', getAllCompany)

employerRoutes.post('/add-company/:id',authenticationUser(),validateAddEmployer,addCompany)

employerRoutes.put('/update-company/:id/:companyId', authenticationUser(),validateUpdateEmployer,updateCompany)

employerRoutes.get('/employer-company/:companyId', getEmployerCompany)

employerRoutes.delete('/delete-company/:id/:companyId', authenticationUser(), deleteCompany);


export default employerRoutes;