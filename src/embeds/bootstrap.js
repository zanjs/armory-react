// @flow

import Base from '../Base';
import ReactDOM from 'react-dom';
import Tooltip from 'common/components/Tooltip';

function bootstrapEmbeds () {
  if (!document.body) {
    throw new Error('Document body not loaded!');
  }

  const embedables = Array.from(document.body.querySelectorAll('[data-armory-embed]'));
  embedables.forEach((element) => {
    let embedName = element.getAttribute('data-armory-embed');
    const rawIds = element.getAttribute('data-armory-ids');

    if (embedName === 'character') {
      embedName = 'characterNew';
    }

    const ids = (rawIds || '').split(',');

    // eslint-disable-next-line import/no-webpack-loader-syntax
    const load = require(`promise?global!embeds/${embedName}`);
    load().then(({ default: createEmbed }) => {
      const Component = createEmbed(element, ids);

      ReactDOM.render(
        <Base>
          <Component />
        </Base>,
        element
      );
    });
  });
}

function bootstrapTooltip () {
  const tooltipContainer = document.createElement('div');
  if (!document.body) {
    throw new Error('Document body not loaded!');
  }

  document.body.appendChild(tooltipContainer);

  ReactDOM.render(
    <Base>
      <Tooltip showBadge />
    </Base>,
    tooltipContainer
  );
}

export default function bootstrap () {
  bootstrapEmbeds();
  bootstrapTooltip();
}
