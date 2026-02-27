import React from 'react'
import { Platform } from 'react-native';
import { useYouTubePlayer, YoutubeView } from 'react-native-youtube-bridge';

export default function TrailerSection({videoKey}: {videoKey: string}) {
    const player = useYouTubePlayer(videoKey, {
        autoplay: false,
        controls: true,
        playsinline: true,
        rel: false,
        muted: true,
    });
    return (
        <YoutubeView
            useInlineHtml={false}
            player={player}
            height={Platform.OS === "web" ? "auto" : undefined}
            webViewProps={{
                renderToHardwareTextureAndroid: true,
            }}
            style={{
                minWidth: 344,
            }}
            iframeStyle={{
                aspectRatio: 16 / 9,
            }}
        />
    )
}
