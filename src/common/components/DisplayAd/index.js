// @flow

import { Component } from 'react';
import cx from 'classnames';

import styles from './styles.less';
import config from 'config';

type Props = {
  className?: string,
  location: 'atf' | 'btf',
  type: 'responsive' | 'leaderboard',
};

const mapping = {
  leaderboard: {
    atf: '3836481086',
    btf: '8266680689',
  },
  responsive: {
    atf: '3836481086',
    btf: '9743413883',
  },
};

export default class DisplayAd extends Component {
  props: Props;

  componentDidMount () {
    if (!config.features.ads) {
      return;
    }

    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  render () {
    const { className, location, type } = this.props;
    const dataProps = {
      'data-ad-client': config.ads.client,
      'data-ad-slot': mapping[type][location],
      'data-ad-format': type === 'responsive' && 'auto',
    };

    return config.features.ads ? (
      <div className={cx(styles.root, className)}>
        <ins
          className={cx(styles.container, 'adsbygoogle')}
          {...dataProps}
        />
      </div>
    ) : null;
  }
}
