import { Ticket } from '../Ticket';

it('implements optimistic concurrency control', async () => {
  // Create an instance of ticket
  const ticket = Ticket.build({
    title: 'test',
    price: 200,
    userId: '123',
  });

  // Save the ticket to the database
  await ticket.save();

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // Save the first fetched ticket
  await firstInstance!.save();

  try {
    // save the second fetched ticket and expect an error
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error('Should not reach this point');
});

it('increments version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'test',
    price: 200,
    userId: '123',
  });

  ticket.price = 300;
  await ticket.save();
  expect(ticket.version).toEqual(0);

  ticket.price = 400;
  await ticket.save();
  expect(ticket.version).toEqual(1);

  ticket.price = 500;
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
