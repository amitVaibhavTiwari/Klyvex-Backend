import { AppDataSource } from "../dataSource/dataSource.js";
import { Books } from "../entities/Books.js";
import { Librarians } from "../entities/librarians.js";
import { Loans } from "../entities/Loans.js";
import { Students } from "../entities/students.js";
import { AccountUser } from "../entities/AccountUser.js";
import { UserAddress } from "../entities/UserAddress.js";
import { UserEmail } from "../entities/UserEmail.js";
import { UserPhone } from "../entities/UserPhone.js";

export const bookRepository = AppDataSource.getRepository(Books);
export const librarianRepository = AppDataSource.getRepository(Librarians);
export const studentRepository = AppDataSource.getRepository(Students);
export const loanRepository = AppDataSource.getRepository(Loans);
// delete above repositories later
export const accountUserRepository = AppDataSource.getRepository(AccountUser);
export const userEmailRepository = AppDataSource.getRepository(UserEmail);
export const userPhoneRepository = AppDataSource.getRepository(UserPhone);
export const userAddressRepository = AppDataSource.getRepository(UserAddress);
