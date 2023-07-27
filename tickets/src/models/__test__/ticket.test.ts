import { Ticket } from "../ticket-schema";

it('implements optimistic concurrency control', async () => {
    const ticket = Ticket.build({
        title: 'first',
        price: 20,
        userId: '123'
    });
    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance.set({ price: 1 });
    secondInstance.set({ price: 2 });

    await firstInstance.save();
    try {
        await secondInstance.save();
    } catch (err) {
        return;
    }
    throw new Error('should not reach this point');
});

it('increments the version number on multiple save', async () => {
    const ticket = Ticket.build({
        title: 'first',
        price: 20,
        userId: '123'
    });
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
})