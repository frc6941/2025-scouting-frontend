"use client";

import {useSearchParams} from "next/navigation";
import {useEffect, Suspense} from "react";
import {setCookie} from "cookies-next/client";

interface Response {
  accessToken: string;
}

export const dynamic = 'force-dynamic'

export default function FeishuAuthPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    async function fetchData() {
      const data = await fetch(
        `http://localhost:3001/auth/feishu/authenticate?code=${code}`,
        {
          mode: "cors",
        }
      );
      const token: Response = await data.json();
      setCookie("Authorization", token.accessToken);
      await new Promise(resolve => setTimeout(resolve, 300));
      window.location.href = "/";
    }
    fetchData();
  }, [code]);

  return (<></>);
}
