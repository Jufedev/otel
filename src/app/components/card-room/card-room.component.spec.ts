import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRoomComponent } from './card-room.component';

describe('CardRoomComponent', () => {
  let component: CardRoomComponent;
  let fixture: ComponentFixture<CardRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
