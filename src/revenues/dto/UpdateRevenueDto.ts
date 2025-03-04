import { RevenueDto } from "./RevenueDto"
import { PartialType } from "@nestjs/mapped-types"

export class UpdateRevenueDto extends PartialType(RevenueDto){ }
