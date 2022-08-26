import { Teact } from "../../Teact";
import React from '../../../../../preact/compat';
import { supportsWebKitPresentationMode } from '../utils'
import { canPlay, AUDIO_EXTENSIONS } from '../patterns'
import YouTube from "./YouTube";
import { FilePlayer } from './FilePlayer';

export default [
    {
        key: 'youtube',
        name: 'YouTube',
        canPlay: canPlay.youtube,
        lazyPlayer: YouTube
    },
    {
        key: 'file',
        name: 'FilePlayer',
        canPlay: canPlay.file,
        canEnablePIP: url => {
            return canPlay.file(url) && ((document as any).pictureInPictureEnabled || supportsWebKitPresentationMode()) && !AUDIO_EXTENSIONS.test(url)
        },
        lazyPlayer: FilePlayer
    }

]