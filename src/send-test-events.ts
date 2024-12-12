#!/usr/bin/env ts-node
import {
  ButtonEventDto,
  FormFieldEventDto,
  FormPageEventDto,
  ScreenEventDto,
} from './tracking.dto';

type EventTypeMap = {
  button: ButtonEventDto;
  form_field: FormFieldEventDto;
  form_page: FormPageEventDto;
  screen: ScreenEventDto;
};

async function sendTrackingEvent<K extends keyof EventTypeMap>(
  type: K,
  payload: EventTypeMap[K],
) {
  return fetch('http://localhost:3000/tracking/' + type, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

(async () => {
  let start_timestamp = Date.now();
  const secondsFromStart = (seconds: number) =>
    (start_timestamp = Math.trunc(start_timestamp + 1000 * seconds));

  await sendTrackingEvent('screen', {
    user: 1,
    session: 10,
    timestamp: secondsFromStart(0),
    url: '/help',
    screen_name: 'Central de ajuda',
    action: 'enter',
  });

  await sendTrackingEvent('button', {
    user: 1,
    session: 10,
    timestamp: secondsFromStart(5),
    url: '/help',
    button_text: 'Ver mais perguntas frequentes',
    button_id: 'show_more_faq',
    container_name: 'faq_container',
  });

  await sendTrackingEvent('form_field', {
    user: 1,
    session: 10,
    timestamp: secondsFromStart(5),
    url: '/help/faq',
    form_name: 'Pesquisar perguntas',
    field_name: 'Texto de pesquisa',
    field_type: 'text',
    optional: true,
    seconds_taken: 10,
    characters_written: 20,
    characters_deleted: 2,
  });

  await sendTrackingEvent('form_page', {
    user: 1,
    session: 10,
    timestamp: secondsFromStart(25),
    url: '/help/faq',
    form_name: 'Pesquisar perguntas',
    seconds_taken: 15,
    amount_fields: 3,
    amount_filled_fields: 1,
    amount_optional_fields: 3,
  });

  await sendTrackingEvent('screen', {
    user: 1,
    session: 10,
    timestamp: secondsFromStart(20),
    url: '/help/faq',
    screen_name: 'Perguntas frequentes',
    action: 'leave',
  });

  await sendTrackingEvent('screen', {
    user: 1,
    session: 10,
    timestamp: secondsFromStart(5),
    url: '/help',
    screen_name: 'Central de ajuda',
    action: 'leave',
  });
})();
