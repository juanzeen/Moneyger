import { IsJWT, IsString } from "class-validator";

export class AuthResponseDto{
  @IsString()
  id: string

  @IsString()
  name: string

  @IsJWT()
  access_token: string

}
