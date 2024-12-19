import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { useGetInstagramConversationQuery } from "services/messenger.api";
import { selectCurrentStore } from "store/slice/AuthSlice";
import { useAppSelector, useAppDispatch } from "store/store.hooks";
import {
  useKycCurrentStateQuery,
  useSendInstagramWebhookAuthorizationMutation,
} from "services";
import { selectMetaData, setWebhookMessage } from "store/slice/InstagramSlice";
import {
  setKycDisplayServiceRestoredBanner,
  setKycUptime,
} from "store/slice/KycServiceStatusSlice";

export const usePusherHook = () => {
  const selectedMetaData = useAppSelector(selectMetaData);
  const pageAccessToken = selectedMetaData?.integration
    ?.page_access_token as string;

  const pageId = selectedMetaData?.integration?.page_id as string;
  // eslint-disable-next-line

  const igId = selectedMetaData?.integration?.igid as string;
  const selectedCurrentStore = useAppSelector(selectCurrentStore);
  const dispatch = useAppDispatch();
  const [skip, setSkip] = useState(true);

  useGetInstagramConversationQuery(
    { limit: 400, pageId, pageAccessToken },
    { skip, refetchOnMountOrArgChange: true }
  );

  const [sendInstagramWebhookAuthorization] =
    useSendInstagramWebhookAuthorizationMutation();

  const { data: kycStateData, refetch: refetchKycCurrentState } =
    useKycCurrentStateQuery(undefined, {
      skip: !selectedCurrentStore?.id,
      refetchOnMountOrArgChange: true,
    });

  useEffect(() => {
    if (kycStateData && kycStateData.success) {
      dispatch(setKycUptime(kycStateData.data.kyc_uptime));
      dispatch(
        setKycDisplayServiceRestoredBanner(
          kycStateData.data.kyc_display_service_restored_banner
        )
      );
    }
  }, [kycStateData, dispatch]);

  useEffect(() => {
    if (selectedCurrentStore?.id) {
      // eslint-disable-next-line
      const pusher = connect();
      return () => pusher?.disconnect();
    }
    // eslint-disable-next-line
  }, [selectedCurrentStore?.id]);

  const authorizer = (channelName: string) => {
    return {
      authorize: async (socketId: any, callback: any) => {
        const options = {
          path: `${
            import.meta.env.VITE_REACT_APP_BUMBA_WEB_BASE_URL
          }broadcasting/auth`,
          body: {
            socket_id: socketId,
            channel_name: channelName,
          },
          checkNetwork: false,
        };
        try {
          const result = await sendInstagramWebhookAuthorization({
            url: options.path,
            body: options.body,
          });

          if ("data" in result) {
            callback(null, result.data);
          }
        } catch (error) {
          console.log("Error occurred while making the post request:", error);
          // Handle the error here
        }
      },
    };
  };

  const fetchCurrentKYCState = async () => {
    try {
      await refetchKycCurrentState();
    } catch (error) {
      console.error("Error refetching KYC state:", error);
    }
  };

  // eslint-disable-next-line
  const connect = () => {
    const pusher = new Pusher(
      import.meta.env.VITE_REACT_APP_BASE_PUSHER_APP_KEY as string,
      {
        wsHost: import.meta.env.VITE_REACT_APP_BASE_PUSHER_APP_HOST as string,
        wsPort: 443,
        forceTLS: true,
        disableStats: true,
        enabledTransports: ["ws", "wss"],
        cluster: import.meta.env
          .VITE_REACT_APP_BASE_PUSHER_APP_CLUSTER as string,
        authorizer: (channel) => authorizer(channel.name),
      }
    );

    pusher.connection.bind("error", function (err: any) {
      console.log("Pusher error", err);
    });

    pusher.connection.bind(
      "state_change",
      async function (states: { current: string }) {
        if (states?.current === "connected") {
          if (pageAccessToken && pageId) {
            setSkip(false);
          }

          if (selectedCurrentStore?.id) {
            fetchCurrentKYCState();
          }

          const userChannel = pusher.subscribe(
            `private-App.Store.${selectedCurrentStore?.id}`
          );

          const productChannelPublic = pusher.subscribe(
            `App.Store.${selectedCurrentStore?.id}`
          );

          const kycUptimeChannel = pusher.subscribe(
            "private-App.Kyc.Uptime-Update"
          );

          userChannel.bind(
            "App\\Events\\Integration\\Instagram\\NewMessageReceived",
            (data: any) => {
              dispatch(setWebhookMessage(data?.webhook));
            }
          );

          userChannel.bind(
            "App\\Events\\Product\\ProductStockChangeEvent",
            (data: any) => {
              // dispatch(updateProduct(data?.product));
            }
          );

          productChannelPublic.bind(
            "App\\Events\\Product\\ProductStockChangeEvent",
            (data: any) => {
              // dispatch(updateProduct(data?.product));
            }
          );

          kycUptimeChannel.bind(
            "App\\Events\\KycUptimeUpdateEvent",
            (data: any) => {
              dispatch(setKycUptime(data.meta.data.kyc_uptime));
              dispatch(
                setKycDisplayServiceRestoredBanner(
                  data.meta.data.kyc_display_service_restored_banner
                )
              );
            }
          );
        }
      }
    );

    return pusher;
  };
};
