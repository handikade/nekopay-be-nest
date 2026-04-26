import { ApiErrors401, ApiErrors403, ApiErrors404 } from '@libs/swagger';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '@src/_core/types/authenticated-request.type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseDTO } from './user.dto';
import { UserService } from './user.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get user detail
   */
  @ApiResponse({
    status: 200,
    description: 'Return the user detail',
    type: UserResponseDTO,
  })
  @ApiErrors401()
  @ApiErrors403()
  @ApiErrors404('User')
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const user = await this.userService.findOne(id, req.user);
    return user;
  }
}
