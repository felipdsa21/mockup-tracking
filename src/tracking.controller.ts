import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import {
  ButtonEventDto,
  FormFieldEventDto,
  FormPageEventDto,
  ScreenEventDto,
  TrackedEventDto,
} from './tracking.dto';
import {
  ButtonEvent,
  FormFieldEvent,
  FormPageEvent,
  ScreenEvent,
  TrackedEvent,
} from './tracking.entity';
import {
  ButtonTrackingService,
  FormFieldTrackingService,
  FormPageTrackingService,
  ScreenTrackingService,
  TrackingService,
} from './tracking.service';

export abstract class TrackingController<T extends TrackedEvent> {
  protected readonly logger: Logger;

  constructor(private readonly trackingService: TrackingService<T>) {
    this.logger = new Logger(this.constructor.name);
  }

  @Post()
  async create(@Body() dto: Omit<T, 'id'>) {
    const entity = await this.trackingService.create(dto);
    this.logCreate(dto);
    return { id: entity.id };
  }

  abstract logCreate(dto: Omit<T, 'id'>): void;

  @Get()
  async findAll() {
    return this.trackingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.trackingService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.trackingService.remove(+id);
  }
}

@Controller('tracking/button')
export class ButtonTrackingController extends TrackingController<ButtonEvent> {
  constructor(trackingService: ButtonTrackingService) {
    super(trackingService);
  }

  override logCreate(dto: ButtonEventDto) {
    this.logger.log(
      `${getLogMsgPrefix(dto)} apertou botão "${dto.button_text}" (elemento #${dto.button_id})`,
    );
  }
}

@Controller('tracking/form_field')
export class FormFieldTrackingController extends TrackingController<FormFieldEvent> {
  constructor(trackingService: FormFieldTrackingService) {
    super(trackingService);
  }

  override logCreate(dto: FormFieldEventDto) {
    const typeMsg = dto.optional ? 'opcional' : 'requerido';
    this.logger.log(
      `${getLogMsgPrefix(dto)} demorou ${dto.seconds_taken} segundos para preencher o campo ${typeMsg} "${dto.field_name}"`,
    );
  }
}

@Controller('tracking/form_page')
export class FormPageTrackingController extends TrackingController<FormPageEvent> {
  constructor(trackingService: FormPageTrackingService) {
    super(trackingService);
  }

  override logCreate(dto: FormPageEventDto) {
    this.logger.log(
      `${getLogMsgPrefix(dto)} preencheu ${dto.amount_filled_fields} dos ${dto.amount_fields} campos do formulário "${dto.form_name}" em ${dto.seconds_taken} segundos`,
    );
  }
}

@Controller('tracking/screen')
export class ScreenTrackingController extends TrackingController<ScreenEvent> {
  constructor(trackingService: ScreenTrackingService) {
    super(trackingService);
  }

  override logCreate(dto: ScreenEventDto) {
    const actionMsg = dto.action == 'enter' ? 'entrou na' : 'saiu da';
    this.logger.log(
      `${getLogMsgPrefix(dto)} ${actionMsg} tela "${dto.screen_name}"`,
    );
  }
}

function getLogMsgPrefix(dto: TrackedEventDto) {
  return `${dto.url}: Usuário ${dto.user}`;
}
