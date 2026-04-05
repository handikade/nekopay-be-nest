import { Controller, Get } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('/')
  @ApiOperation({ summary: 'Check application and database health status' })
  @ApiOkResponse({
    description: 'The health status of the application and database',
    schema: {
      example: {
        status: 'ok',
        service: 'up',
        database: 'up',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'The health status when database is down',
    schema: {
      example: {
        status: 'error',
        service: 'up',
        database: 'down',
        error: 'Connection refused',
      },
    },
  })
  async healthCheck() {
    return this.healthService.checkHealth();
  }
}
