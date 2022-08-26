import { Teact } from "../Teact";
import React  from '../../../../preact/compat';


import { omit } from './utils'
import Player from './Player'
import { isEqual } from "./fast-compare/fast-compare";
import memoizeOne from "./memoize-one/memoize-one";
import { deepmerge } from './deepmerge/deepmerge';
import { Preview } from './Preview';


const noop = () => {}

export const defaultProps = {
  playing: false,
  loop: false,
  controls: false,
  volume: null,
  muted: false,
  playbackRate: 1,
  width: '640px',
  height: '360px',
  style: {},
  progressInterval: 1000,
  playsinline: false,
  pip: false,
  stopOnUnmount: true,
  light: false,
  fallback: null,
  wrapper: 'div',
  previewTabIndex: 0,
  config: {
    soundcloud: {
      options: {
        visual: true, // Undocumented, but makes player fill container and look better
        buying: false,
        liking: false,
        download: false,
        sharing: false,
        show_comments: false,
        show_playcount: false
      }
    },
    youtube: {
      playerVars: {
        playsinline: 1,
        showinfo: 0,
        rel: 0,
        iv_load_policy: 3,
        modestbranding: 1
      },
      embedOptions: {},
      onUnstarted: noop
    },
    facebook: {
      appId: '1309697205772819',
      version: 'v3.3',
      playerId: null,
      attributes: {}
    },
    dailymotion: {
      params: {
        api: 1,
        'endscreen-enable': false
      }
    },
    vimeo: {
      playerOptions: {
        autopause: false,
        byline: false,
        portrait: false,
        title: false
      }
    },
    file: {
      attributes: {},
      tracks: [],
      forceVideo: false,
      forceAudio: false,
      forceHLS: false,
      forceDASH: false,
      forceFLV: false,
      hlsOptions: {},
      hlsVersion: '0.14.16',
      dashVersion: '3.1.3',
      flvVersion: '1.5.0'
    },
    wistia: {
      options: {},
      playerId: null,
      customControls: null
    },
    mixcloud: {
      options: {
        hide_cover: 1
      }
    },
    twitch: {
      options: {},
      playerId: null
    },
    vidyard: {
      options: {}
    }
  },
  onReady: noop,
  onStart: noop,
  onPlay: noop,
  onPause: noop,
  onBuffer: noop,
  onBufferEnd: noop,
  onEnded: noop,
  onError: noop,
  onDuration: noop,
  onSeek: noop,
  onProgress: noop,
  onClickPreview: noop,
  onEnablePIP: noop,
  onDisablePIP: noop
}

//const Preview = lazy(() => import(/* webpackChunkName: 'reactPlayerPreview' */'./Preview'))

const IS_BROWSER = typeof window !== 'undefined' && window.document
const IS_GLOBAL = typeof global !== 'undefined' && global.window && global.window.document
//const SUPPORTED_PROPS = Object.keys(propTypes)

// Return null when rendering on the server
// as Suspense is not supported yet
//const UniversalSuspense = IS_BROWSER || IS_GLOBAL ? Suspense : () => null

const customPlayers: any[] = []

export const createReactPlayer: any = (players, fallback) => {
  return class ReactPlayer extends React.Component {
    static displayName = 'ReactPlayer'
    //static propTypes = propTypes
    static defaultProps = defaultProps
    static addCustomPlayer = player => { customPlayers.push(player) }
    static removeCustomPlayers = () => { customPlayers.length = 0 }

    static canPlay = url => {
      for (const Player of [...customPlayers, ...players]) {
        if (Player.canPlay(url)) {
          return true
        }
      }
      return false
    }

    static canEnablePIP = url => {
      for (const Player of [...customPlayers, ...players]) {
        if (Player.canEnablePIP && Player.canEnablePIP(url)) {
          return true
        }
      }
      return false
    }

    state = {
      showPreview: !!this.props.light
    }

    // Use references, as refs is used by React
    references = {
      wrapper: wrapper => { this.wrapper = wrapper },
      player: player => { this.player = player }
    }
    wrapper: any;
    player: any;

    shouldComponentUpdate (nextProps, nextState) {
      return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState)
    }

    componentDidUpdate (prevProps) {
      const { light } = this.props
      if (!prevProps.light && light) {
        this.setState({ showPreview: true })
      }
      if (prevProps.light && !light) {
        this.setState({ showPreview: false })
      }
    }

    handleClickPreview = (e) => {
      this.setState({ showPreview: false })
      this.props.onClickPreview(e)
    }

    showPreview = () => {
      this.setState({ showPreview: true })
    }

    getDuration = () => {
      if (!this.player) return null
      return this.player.getDuration()
    }

    getCurrentTime = () => {
      if (!this.player) return null
      return this.player.getCurrentTime()
    }

    getSecondsLoaded = () => {
      if (!this.player) return null
      return this.player.getSecondsLoaded()
    }

    getInternalPlayer = (key = 'player') => {
      if (!this.player) return null
      return this.player.getInternalPlayer(key)
    }

    seekTo = (fraction, type) => {
      if (!this.player) return null
      this.player.seekTo(fraction, type)
    }

    handleReady = () => {
      this.props.onReady(this)
    }

    getActivePlayer = memoizeOne(url => {
      for (const player of [...customPlayers, ...players]) {
        if (player.canPlay(url)) {
          return player
        }
      }
      if (fallback) {
        return fallback
      }
      return null
    })

    getConfig = memoizeOne((url, key) => {
      const { config } = this.props
      return deepmerge.all([
        defaultProps.config,
        defaultProps.config[key] || {},
        config,
        config[key] || {}
      ])
    })

    getAttributes = memoizeOne(url => {
      return omit(this.props, {}/* SUPPORTED_PROPS */)
    })

    renderPreview (url) {
      if (!url) return null
      const { light, playIcon, previewTabIndex } = this.props
      return (
        <Preview
          url={url}
          light={light}
          playIcon={playIcon}
          previewTabIndex={previewTabIndex}
          onClick={this.handleClickPreview}
        />
      )
    }

    renderActivePlayer = url => {
      if (!url) return null
      const player = this.getActivePlayer(url)
      if (!player) return null
      const config = this.getConfig(url, player.key)
      return (
        <Player
          {...this.props}
          key={player.key}
          ref={this.references.player}
          config={config}
          activePlayer={player.lazyPlayer || player}
          onReady={this.handleReady}
        />
      )
    }

    render () {
      const { url, style, width, height, fallback, wrapper: Wrapper } = this.props
      const { showPreview } = this.state
      const attributes = this.getAttributes(url)
      return (
        <Wrapper ref={this.references.wrapper} style={{ ...style, width, height }} {...attributes}>
        {/*   <UniversalSuspense fallback={fallback}> */}
            {showPreview
              ? this.renderPreview(url)
              : this.renderActivePlayer(url)}
        {/*   </UniversalSuspense> */}
        </Wrapper>
      )
    }
  }
}