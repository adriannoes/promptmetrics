/**
 * Enterprise Patterns for Type Safety and Maintainability
 */

// Result Pattern for Error Handling
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Option Pattern for Null Safety
export type Option<T> = T | null;

// Command Pattern for Actions
export interface Command {
  execute(): Promise<Result<void>>;
}

// Query Pattern for Data Retrieval
export interface Query<T> {
  execute(): Promise<Result<T>>;
}

// Repository Pattern for Data Access
export interface Repository<T, ID = string> {
  findById(id: ID): Promise<Result<T | null>>;
  findAll(): Promise<Result<T[]>>;
  create(data: Omit<T, 'id'>): Promise<Result<T>>;
  update(id: ID, data: Partial<T>): Promise<Result<T>>;
  delete(id: ID): Promise<Result<void>>;
}

// Service Pattern for Business Logic
export interface Service<T> {
  process(data: T): Promise<Result<T>>;
}

// Event Pattern for Decoupled Communication
export interface DomainEvent {
  readonly type: string;
  readonly payload: Record<string, unknown>;
  readonly timestamp: Date;
  readonly aggregateId: string;
}

export interface EventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): void;
  unsubscribe(eventType: string, handler: EventHandler<DomainEvent>): void;
}

// Value Object Pattern
export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = value;
    this.validate();
  }

  protected abstract validate(): void;

  get value(): T {
    return this._value;
  }

  equals(other: ValueObject<T>): boolean {
    return JSON.stringify(this._value) === JSON.stringify(other._value);
  }
}

// Entity Pattern
export abstract class Entity<T> {
  protected readonly _id: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;

  constructor(id: string, createdAt?: Date, updatedAt?: Date) {
    this._id = id;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }

  abstract equals(other: Entity<T>): boolean;
}

// Aggregate Root Pattern
export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  get domainEvents(): readonly DomainEvent[] {
    return this._domainEvents;
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }
}

// Factory Pattern
export interface Factory<T, P = unknown> {
  create(params: P): Result<T>;
}

// Specification Pattern
export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
  and(other: Specification<T>): Specification<T>;
  or(other: Specification<T>): Specification<T>;
  not(): Specification<T>;
}

// Unit of Work Pattern
export interface UnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  isActive(): boolean;
}

// Observer Pattern
export interface Observer<T> {
  update(subject: T): void;
}

export interface Subject<T> {
  attach(observer: Observer<T>): void;
  detach(observer: Observer<T>): void;
  notify(): void;
}

// Strategy Pattern
export interface Strategy<T, R> {
  execute(input: T): R;
}

export interface StrategyContext<T, R> {
  setStrategy(strategy: Strategy<T, R>): void;
  execute(input: T): R;
}
