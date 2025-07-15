import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../../application/services/user.service';
import { CreateUserDto } from '../../application/dtos/register-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { AuthGuard } from '../middlewares/auth.middleware';
import { AuditLogService } from '../../infrastructure/external/audit-log.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private auditLogService: AuditLogService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    await this.auditLogService.logAction('create_user', {
      userId: user.id,
      email: dto.email,
      role: dto.role,
    });
    return user;
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update(id, dto);
    await this.auditLogService.logAction('update_user', {
      userId: id,
      updatedFields: Object.keys(dto),
    });
    return user;
  }

  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return await this.userService.getAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    const user = await this.userService.getById(id);
    await this.auditLogService.logAction('get_user', { userId: id });
    return user;
  }
}
