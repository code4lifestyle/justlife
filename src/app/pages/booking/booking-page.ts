import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { sendBookingEmail } from './booking-mail';
import { BookingPageContent } from './booking.resolver';

const IN_CITY_HOURLY = 30;
const OUT_OF_CITY_HOURLY = 40;
const MATERIALS_FEE = 5;
const OFFER_AMOUNT = 150;

const TIMES = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'] as const;

interface DayOption {
  iso: string;
  weekday: string;
  day: number;
  label: string;
}

function localIso(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Checkout screen shared by every bookable service, matching Justlife's step 1 funnel. */
@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.html',
  styleUrl: './booking-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingPage {
  private readonly router = inject(Router);

  readonly content = input.required<BookingPageContent>();

  protected readonly inCityHourly = IN_CITY_HOURLY;
  protected readonly outOfCityHourly = OUT_OF_CITY_HOURLY;
  protected readonly materialsPrice = MATERIALS_FEE;
  protected readonly hoursOptions = [1, 2, 3, 4, 5, 6, 7, 8];
  protected readonly professionalOptions = [1, 2, 3, 4];
  protected readonly times = TIMES;
  protected readonly dates: DayOption[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      iso: localIso(date),
      weekday: date.toLocaleDateString('en', { weekday: 'short' }),
      day: date.getDate(),
      label: date.toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' }),
    };
  });

  protected readonly step = signal(1);
  protected readonly hours = signal(2);
  protected readonly professionals = signal(1);
  protected readonly outsideCity = signal(false);
  protected readonly materials = signal(false);
  protected readonly instructions = signal('');
  protected readonly offerApplied = signal(false);
  protected readonly showHoursHelp = signal(false);
  protected readonly date = signal<string | null>(null);
  protected readonly time = signal<string | null>(null);
  protected readonly customerName = signal('');
  protected readonly phone = signal('');
  protected readonly address = signal('');
  protected readonly stepError = signal('');
  protected readonly sending = signal(false);

  protected readonly service = computed(() => this.content().service);
  protected readonly selectedDateLabel = computed(
    () => this.dates.find((day) => day.iso === this.date())?.label ?? '',
  );
  protected readonly hourlyRate = computed(() =>
    this.outsideCity() ? OUT_OF_CITY_HOURLY : IN_CITY_HOURLY,
  );
  protected readonly labour = computed(() => this.hours() * this.professionals() * this.hourlyRate());
  protected readonly materialsFee = computed(() => (this.materials() ? MATERIALS_FEE : 0));
  protected readonly subtotal = computed(() => this.labour() + this.materialsFee());
  protected readonly discount = computed(() =>
    this.offerApplied() ? Math.min(OFFER_AMOUNT, this.subtotal()) : 0,
  );
  protected readonly total = computed(() => this.subtotal() - this.discount());

  constructor() {
    effect(() => {
      this.content();
      untracked(() => {
        this.step.set(1);
        this.hours.set(2);
        this.professionals.set(1);
        this.outsideCity.set(false);
        this.materials.set(false);
        this.instructions.set('');
        this.offerApplied.set(false);
        this.showHoursHelp.set(false);
        this.date.set(null);
        this.time.set(null);
        this.customerName.set('');
        this.phone.set('');
        this.address.set('');
        this.stepError.set('');
        this.sending.set(false);
      });
    });
  }

  protected money(amount: number): string {
    return `AED ${amount.toFixed(2)}`;
  }

  protected timeLabel(value: string): string {
    const [hourText, minute] = value.split(':');
    const hour = Number(hourText);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${suffix}`;
  }

  protected back(): void {
    this.stepError.set('');
    if (this.step() === 1) {
      this.home();
      return;
    }
    this.step.update((current) => current - 1);
  }

  protected home(): void {
    void this.router.navigateByUrl(`/${this.content().shell.locale}`);
  }

  protected next(): void {
    this.stepError.set('');
    if (this.step() === 2 && (!this.date() || !this.time())) {
      this.stepError.set('Choose a date and a time to continue');
      return;
    }
    if (this.step() === 3) {
      if (this.customerName().trim().length < 2) {
        this.stepError.set('Enter your name');
        return;
      }
      if (!this.phoneLooksValid(this.phone())) {
        this.stepError.set('Enter a phone number so we can confirm the booking');
        return;
      }
      if (!this.address().trim()) {
        this.stepError.set('Enter the address where you want the service');
        return;
      }
      void this.submitBooking();
      return;
    }
    if (this.step() < 4) this.step.update((current) => current + 1);
  }

  private phoneLooksValid(value: string): boolean {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15;
  }

  private async submitBooking(): Promise<void> {
    if (this.sending()) return;
    this.sending.set(true);
    try {
      await sendBookingEmail({
        service: this.service().name,
        date: this.selectedDateLabel(),
        time: this.timeLabel(this.time()!),
        duration: `${this.hours()} ${this.hours() === 1 ? 'hour' : 'hours'}`,
        professionals: String(this.professionals()),
        location: this.outsideCity() ? 'Out of the city' : 'In the city',
        rate: `${this.money(this.hourlyRate())} per hour`,
        materials: this.materials() ? `Yes (${this.money(MATERIALS_FEE)})` : 'No',
        instructions: this.instructions().trim(),
        address: this.address().trim(),
        name: this.customerName().trim(),
        phone: this.phone().trim(),
        total: this.money(this.total()),
        offer: this.offerApplied() ? '50X3 applied' : 'None',
      });
      this.step.set(4);
    } catch {
      this.stepError.set("We couldn't send your booking. Please try again.");
    } finally {
      this.sending.set(false);
    }
  }

  protected applyOffer(): void {
    this.offerApplied.set(true);
  }
}
