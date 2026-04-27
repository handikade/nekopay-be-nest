import { ApiErrors401, ApiErrors404, ApiErrors500 } from '@libs/swagger';
import { Controller, ForbiddenException, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '@src/_core/types/authenticated-request.type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserListResponseDTO, UserQueryParamsDTO, UserResponseDTO } from './user.dto';
import { UserService } from './user.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiErrors401()
@ApiErrors500()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * List Users (Admin only)
   */
  @ApiResponse({
    status: 200,
    description: 'Return list of users',
    type: UserListResponseDTO,
  })
  @Get()
  async findAll(@Req() req: AuthenticatedRequest, @Query() query: UserQueryParamsDTO) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admin can access this resource');
    }
    return await this.userService.findAll(query);
  }

  /**
   * Get User by ID
   */
  @ApiResponse({
    status: 200,
    description: 'Return the user detail',
    type: UserResponseDTO,
  })
  @ApiErrors404('User')
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    if (req.user.role !== 'admin' && req.user.id !== id) {
      throw new ForbiddenException('You do not have permission to access this user');
    }
    const user = await this.userService.findOne(id);
    return user;
  }
}
