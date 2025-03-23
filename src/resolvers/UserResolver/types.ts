import { ObjectType, Field } from "type-graphql";
import { AccountUser } from "../../entities/AccountUser.js";

@ObjectType() // this objectType decorator helps in type-graphQl to recognize that this is a type and it will be used in the schema
export class UserRegisterResponse {
  @Field(() => Boolean)
  otpSent: boolean;

  @Field({ nullable: true })
  error?: string;
}

@ObjectType()
export class GetUserDetailsResponse {
  @Field(() => AccountUser, { nullable: true })
  user?: AccountUser;

  @Field({ nullable: true })
  error?: string;
}
