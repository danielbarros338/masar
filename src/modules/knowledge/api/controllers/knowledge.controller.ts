import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateKnowledgeDto } from '../../application/dto/create-knowledge.dto';
import { KnowledgeResponseDto } from '../../application/dto/knowledge-response.dto';
import { UpdateKnowledgeDto } from '../../application/dto/update-knowledge.dto';
import { CreateKnowledgeUseCase } from '../../application/use-cases/create-knowledge.use-case';
import { DeleteKnowledgeUseCase } from '../../application/use-cases/delete-knowledge.use-case';
import { GetKnowledgeUseCase } from '../../application/use-cases/get-knowledge.use-case';
import { UpdateKnowledgeUseCase } from '../../application/use-cases/update-knowledge.use-case';
import {
    ApiCreateKnowledge,
    ApiDeleteKnowledge,
    ApiGetKnowledge,
    ApiUpdateKnowledge,
} from './knowledge.swagger';

@ApiTags('knowledge')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Não autenticado' })
@Controller('knowledge')
export class KnowledgeController {
  constructor(
    private readonly createKnowledge: CreateKnowledgeUseCase,
    private readonly updateKnowledge: UpdateKnowledgeUseCase,
    private readonly deleteKnowledge: DeleteKnowledgeUseCase,
    private readonly getKnowledge: GetKnowledgeUseCase,
  ) {}

  @Post('create-knowledge')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateKnowledge()
  create(@Body() dto: CreateKnowledgeDto): Promise<KnowledgeResponseDto> {
    return this.createKnowledge.execute(dto);
  }

  @Patch('update-knowledge/:id')
  @HttpCode(HttpStatus.OK)
  @ApiUpdateKnowledge()
  update(
    @Param('id') id: string,
    @Body() dto: UpdateKnowledgeDto,
  ): Promise<KnowledgeResponseDto> {
    return this.updateKnowledge.execute(id, dto);
  }

  @Delete('delete-knowledge/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteKnowledge()
  remove(@Param('id') id: string): Promise<void> {
    return this.deleteKnowledge.execute(id);
  }

  @Get('get-knowledge/:id')
  @HttpCode(HttpStatus.OK)
  @ApiGetKnowledge()
  findOne(@Param('id') id: string): Promise<KnowledgeResponseDto> {
    return this.getKnowledge.execute(id);
  }
}
