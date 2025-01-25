import { formatDateString } from '../lib/utils';
import { parseISO, format } from 'date-fns';
import { expect } from 'chai';

describe('formatDateString', () => {
  it('Should return formatted date', () => {
    const isoDateString = '2019-09-20T20:50:42.399Z';
    const expectedDate = format(
      parseISO(isoDateString),
      'MMMM d, yyyy HH:mm:ss'
    );
    const actualDate = formatDateString(isoDateString);
    expect(actualDate).to.be.eql(expectedDate);
  });

  it('Should return parameter if cannot format', () => {
    const expectedDate = '12345';
    const actualDate = formatDateString('12345');
    expect(actualDate).to.be.eql(expectedDate);
  });
});
