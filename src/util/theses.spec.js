import test from 'ava';

import { formatTheses } from './theses';

test('Thesis formatter finds correct names to thesis', t => {
    const theses = [{ thesisId: 1, title: 'The Gradu' }];
    const persons = [{ personId: 2, firstname: 'First', lastname: 'Last' }];
    const agreements = [{ agreementId: 3, thesisId: 1, authorId: 2 }];

    const formattedTheses = formatTheses(theses, agreements, persons);

    t.is(formattedTheses[0].authorFirstname, 'First');
    t.is(formattedTheses[0].authorLastname, 'Last');
});

test('Thesis formatter finds email to thesis without person', t => {
    const theses = [{ thesisId: 1, title: 'The Gradu' }];
    const persons = [{ personId: 2, firstname: 'First', lastname: 'Last' }];
    const agreements = [{ agreementId: 3, thesisId: 1, authorId: undefined, email: 'test@example.com' }];

    const formattedTheses = formatTheses(theses, agreements, persons);

    t.is(formattedTheses[0].authorEmail, 'test@example.com');
});
