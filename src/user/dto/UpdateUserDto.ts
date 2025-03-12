import { UserDto } from "./UserDto"
import { PartialType } from "@nestjs/mapped-types"

export class UpdateUserDto extends PartialType(UserDto){ }
