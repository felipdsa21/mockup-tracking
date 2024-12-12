import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import {
  ButtonEvent,
  FormFieldEvent,
  FormPageEvent,
  ScreenEvent,
  TrackedEvent,
} from './tracking.entity';

@Injectable()
export class TrackingService<T extends TrackedEvent> {
  constructor(private readonly repository: Repository<T>) {}

  async create(dto: Omit<T, 'id'>) {
    const entity = this.repository.create(dto as DeepPartial<T>);
    return this.repository.save(entity);
  }

  async findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    return this.repository.findOneBy({ id } as FindOptionsWhere<T>);
  }

  async remove(id: number) {
    return this.repository.delete(id);
  }
}

export class ButtonTrackingService extends TrackingService<ButtonEvent> {
  constructor(
    @InjectRepository(ButtonEvent)
    repository: Repository<ButtonEvent>,
  ) {
    super(repository);
  }
}

export class FormFieldTrackingService extends TrackingService<FormFieldEvent> {
  constructor(
    @InjectRepository(FormFieldEvent)
    repository: Repository<FormFieldEvent>,
  ) {
    super(repository);
  }
}

export class FormPageTrackingService extends TrackingService<FormPageEvent> {
  constructor(
    @InjectRepository(FormPageEvent)
    repository: Repository<FormPageEvent>,
  ) {
    super(repository);
  }
}

export class ScreenTrackingService extends TrackingService<ScreenEvent> {
  constructor(
    @InjectRepository(ScreenEvent)
    repository: Repository<ScreenEvent>,
  ) {
    super(repository);
  }
}
