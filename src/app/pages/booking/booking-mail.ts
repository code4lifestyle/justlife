/** Public form key for the admin@aljorycleaning.com inbox. */
const ACCESS_KEY = 'd247f448-d569-43ae-bc80-8fc5bec033f4';

export interface BookingMail {
  service: string;
  date: string;
  time: string;
  duration: string;
  professionals: string;
  location: string;
  rate: string;
  materials: string;
  instructions: string;
  address: string;
  name: string;
  phone: string;
  total: string;
  offer: string;
}

/** Delivers one confirmed booking to admin@aljorycleaning.com. */
export async function sendBookingEmail(booking: BookingMail): Promise<void> {
  const lines = [
    `Service: ${booking.service}`,
    `Customer: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Date: ${booking.date}`,
    `Time: ${booking.time}`,
    booking.duration ? `Duration: ${booking.duration}` : '',
    booking.professionals ? `Professionals: ${booking.professionals}` : '',
    booking.location ? `Location: ${booking.location}` : '',
    booking.rate ? `Rate: ${booking.rate}` : '',
    booking.materials ? `Materials: ${booking.materials}` : '',
    `Address: ${booking.address}`,
    booking.duration ? `Instructions: ${booking.instructions || 'None'}` : '',
    booking.offer ? `Offer: ${booking.offer}` : '',
    booking.total ? `Total: ${booking.total}` : '',
  ].filter(Boolean);

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: `New booking: ${booking.service}`,
      from_name: 'Service bookings',
      name: booking.name,
      phone: booking.phone,
      message: lines.join('\n'),
      Service: booking.service,
      Date: booking.date,
      Time: booking.time,
      ...(booking.duration
        ? {
            Duration: booking.duration,
            Professionals: booking.professionals,
            Location: booking.location,
            Rate: booking.rate,
            Materials: booking.materials,
            Instructions: booking.instructions || 'None',
            Offer: booking.offer,
            Total: booking.total,
          }
        : {}),
      Address: booking.address,
    }),
    signal: AbortSignal.timeout(20000),
  });

  const body = (await response.json()) as { success?: boolean; message?: string };
  if (!response.ok || body.success !== true) {
    throw new Error(body.message || `Booking email failed (${response.status})`);
  }
}
