import { useEffect } from 'react';

export default function usePromiseEffect(callback, memos) {
	return useEffect(() => {
		Promise.resolve(callback()).catch((e) => { throw e; });
	}, memos);
}
