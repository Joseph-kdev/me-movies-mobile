import { useNetInfo } from '@react-native-community/netinfo';
import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import debounce from 'lodash/debounce';
import { SafeAreaView } from 'react-native-safe-area-context';

interface OfflineNoticeProps {
    showFullScreen?: boolean;
    debounceDelay?: number; // optional: customize delay (ms)
}

export default function OfflineNotice({
    showFullScreen = false,
    debounceDelay = 3000, // 3 seconds is a good default to avoid flicker
}: OfflineNoticeProps) {
    const netInfo = useNetInfo();

    const [isOffline, setIsOffline] = useState(false);

    // Memoize the debounced setter so it's stable across renders
    const debouncedSetOffline = useMemo(
        () =>
            debounce((offline: boolean) => {
                setIsOffline(offline);
            }, debounceDelay),
        [debounceDelay]
    );

    useEffect(() => {
        // Compute current offline status safely
        const currentlyOffline =
            netInfo.type !== 'unknown' &&
            (netInfo.isConnected === false || netInfo.isInternetReachable === false);

        if (currentlyOffline) {
            // When offline → queue the show after debounceDelay
            debouncedSetOffline(true);
        } else {
            // When online → cancel any pending debounce and hide immediately
            debouncedSetOffline.cancel();
            setIsOffline(false);
        }

        // Cleanup: cancel on unmount or when dependencies change
        return () => {
            debouncedSetOffline.cancel();
        };
    }, [netInfo, debouncedSetOffline]);

    // Don't render anything unless confirmed offline
    if (!isOffline) {
        return null;
    }

    // Small banner (default)
    if (!showFullScreen) {
        return (
            <SafeAreaView className='relative'>
                <View className="absolute top-0 left-0 right-0 z-[9999]">
                    <View
                        className={`
            bg-red-500 py-3 px-4 items-center justify-center
            ${Platform.OS === 'ios' ? 'pt-10' : 'pt-5'}
            border-b border-red-600
          `}
                    >
                        <Text className="text-white text-sm font-medium text-center">
                            Offline — Some features may be unavailable
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    // Full-screen overlay
    return (
        <SafeAreaView className='relative'>
            <View className="absolute inset-0 bg-black/85 items-center justify-center z-[10000]">
                <View className="bg-gray-800 rounded-2xl p-8 items-center w-[80%] max-w-[360px]">
                    <Text className="text-red-400 text-2xl font-bold mb-4">
                        No Internet Connection
                    </Text>
                    <Text className="text-gray-300 text-base text-center mb-3">
                        This app requires an internet connection to load movie data, trailers, and more.
                    </Text>
                    <Text className="text-gray-500 text-sm text-center">
                        Connect to Wi-Fi or mobile data and try again.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}