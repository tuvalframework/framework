import { Teact } from "../Teact";
import React  from '../../../../preact/compat';
import { isEqual } from './fast-compare/fast-compare';

const noop = () => {}
const defaultProps = {
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

const SEEK_ON_PLAY_EXPIRY = 5000

export default class Player extends React.Component {
  static displayName = 'Player'
  //static propTypes = propTypes
  static defaultProps = defaultProps

  mounted = false
  isReady = false
  isPlaying = false // Track playing state internally to prevent bugs
  isLoading = true // Use isLoading to prevent onPause when switching URL
  loadOnReady = null
  startOnPlay = true
  seekOnPlay = null
  onDurationCalled = false
    progressTimeout: any;
    durationCheckTimeout: any;
    player: any;
    prevPlayed: any;
    prevLoaded: any;

  componentDidMount () {
    this.mounted = true
  }

  componentWillUnmount () {
    clearTimeout(this.progressTimeout)
    clearTimeout(this.durationCheckTimeout)
    if (this.isReady && this.props.stopOnUnmount) {
      this.player.stop()

      if (this.player.disablePIP) {
        this.player.disablePIP()
      }
    }
    this.mounted = false
  }

  componentDidUpdate (prevProps) {
    // If there isn’t a player available, don’t do anything
    if (!this.player) {
      return
    }
    // Invoke player methods based on changed props
    const { url, playing, volume, muted, playbackRate, pip, loop, activePlayer } = this.props
    if (!isEqual(prevProps.url, url)) {
      if (this.isLoading && !activePlayer.forceLoad) {
        console.warn(`ReactPlayer: the attempt to load ${url} is being deferred until the player has loaded`)
        this.loadOnReady = url
        return
      }
      this.isLoading = true
      this.startOnPlay = true
      this.onDurationCalled = false
      this.player.load(url, this.isReady)
    }
    if (!prevProps.playing && playing && !this.isPlaying) {
      this.player.play()
    }
    if (prevProps.playing && !playing && this.isPlaying) {
      this.player.pause()
    }
    if (!prevProps.pip && pip && this.player.enablePIP) {
      this.player.enablePIP()
    }
    if (prevProps.pip && !pip && this.player.disablePIP) {
      this.player.disablePIP()
    }
    if (prevProps.volume !== volume && volume !== null) {
      this.player.setVolume(volume)
    }
    if (prevProps.muted !== muted) {
      if (muted) {
        this.player.mute()
      } else {
        this.player.unmute()
        if (volume !== null) {
          // Set volume next tick to fix a bug with DailyMotion
          setTimeout(() => this.player.setVolume(volume))
        }
      }
    }
    if (prevProps.playbackRate !== playbackRate && this.player.setPlaybackRate) {
      this.player.setPlaybackRate(playbackRate)
    }
    if (prevProps.loop !== loop && this.player.setLoop) {
      this.player.setLoop(loop)
    }
  }

  handlePlayerMount = player => {
    this.player = player
    this.player.load(this.props.url)
    this.progress()
  }

  getDuration () {
    if (!this.isReady) return null
    return this.player.getDuration()
  }

  getCurrentTime () {
    if (!this.isReady) return null
    return this.player.getCurrentTime()
  }

  getSecondsLoaded () {
    if (!this.isReady) return null
    return this.player.getSecondsLoaded()
  }

  getInternalPlayer = (key) => {
    if (!this.player) return null
    return this.player[key]
  }

  progress = () => {
    if (this.props.url && this.player && this.isReady) {
      const playedSeconds = this.getCurrentTime() || 0
      const loadedSeconds = this.getSecondsLoaded()
      const duration = this.getDuration()
      if (duration) {
        const progress: any = {
          playedSeconds,
          played: playedSeconds / duration
        }
        if (loadedSeconds !== null) {
          progress.loadedSeconds = loadedSeconds
          progress.loaded = loadedSeconds / duration
        }
        // Only call onProgress if values have changed
        if (progress.playedSeconds !== this.prevPlayed || progress.loadedSeconds !== this.prevLoaded) {
          this.props.onProgress(progress)
        }
        this.prevPlayed = progress.playedSeconds
        this.prevLoaded = progress.loadedSeconds
      }
    }
    this.progressTimeout = setTimeout(this.progress, this.props.progressFrequency || this.props.progressInterval)
  }

  seekTo (amount, type?) {
    // When seeking before player is ready, store value and seek later
    if (!this.isReady && amount !== 0) {
      this.seekOnPlay = amount
      setTimeout(() => { this.seekOnPlay = null }, SEEK_ON_PLAY_EXPIRY)
      return
    }
    const isFraction = !type ? (amount > 0 && amount < 1) : type === 'fraction'
    if (isFraction) {
      // Convert fraction to seconds based on duration
      const duration = this.player.getDuration()
      if (!duration) {
        console.warn('ReactPlayer: could not seek using fraction – duration not yet available')
        return
      }
      this.player.seekTo(duration * amount)
      return
    }
    this.player.seekTo(amount)
  }

  handleReady = () => {
    if (!this.mounted) return
    this.isReady = true
    this.isLoading = false
    const { onReady, playing, volume, muted } = this.props
    onReady()
    if (!muted && volume !== null) {
      this.player.setVolume(volume)
    }
    if (this.loadOnReady) {
      this.player.load(this.loadOnReady, true)
      this.loadOnReady = null
    } else if (playing) {
      this.player.play()
    }
    this.handleDurationCheck()
  }

  handlePlay = () => {
    this.isPlaying = true
    this.isLoading = false
    const { onStart, onPlay, playbackRate } = this.props
    if (this.startOnPlay) {
      if (this.player.setPlaybackRate && playbackRate !== 1) {
        this.player.setPlaybackRate(playbackRate)
      }
      onStart()
      this.startOnPlay = false
    }
    onPlay()
    if (this.seekOnPlay) {
      this.seekTo(this.seekOnPlay)
      this.seekOnPlay = null
    }
    this.handleDurationCheck()
  }

  handlePause = (e) => {
    this.isPlaying = false
    if (!this.isLoading) {
      this.props.onPause(e)
    }
  }

  handleEnded = () => {
    const { activePlayer, loop, onEnded } = this.props
    if (activePlayer.loopOnEnded && loop) {
      this.seekTo(0)
    }
    if (!loop) {
      this.isPlaying = false
      onEnded()
    }
  }

  handleError = (...args) => {
    this.isLoading = false
    this.props.onError(...args)
  }

  handleDurationCheck = () => {
    clearTimeout(this.durationCheckTimeout)
    const duration = this.getDuration()
    if (duration) {
      if (!this.onDurationCalled) {
        this.props.onDuration(duration)
        this.onDurationCalled = true
      }
    } else {
      this.durationCheckTimeout = setTimeout(this.handleDurationCheck, 100)
    }
  }

  handleLoaded = () => {
    // Sometimes we know loading has stopped but onReady/onPlay are never called
    // so this provides a way for players to avoid getting stuck
    this.isLoading = false
  }

  render () {
    const Player = this.props.activePlayer;
    if (!Player) {
      return null
    }
    return (
      <Player
        {...this.props}
        onMount={this.handlePlayerMount}
        onReady={this.handleReady}
        onPlay={this.handlePlay}
        onPause={this.handlePause}
        onEnded={this.handleEnded}
        onLoaded={this.handleLoaded}
        onError={this.handleError}
      />
    )
  }
}