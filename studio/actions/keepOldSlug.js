// "Publish" for posts: when the address (slug) changed since the last publish, the old address is saved in
// "Endereços antigos" (oldSlugs) before publishing, so the site sends anyone using the old link to the new one.
export function keepOldSlug(originalAction, context) {
  const client = context.getClient({ apiVersion: '2025-02-19' });
  function KeepOldSlugPublish(props) {
    const original = originalAction(props);
    return {
      ...original,
      onHandle: async () => {
        const before = props.published?.slug?.current;
        const after = props.draft?.slug?.current;
        if (props.draft && before && after && before !== after) {
          const known = Array.isArray(props.draft.oldSlugs) ? props.draft.oldSlugs : [];
          const next = [...known.filter((s) => s !== before && s !== after), before];
          await client.patch(props.draft._id).set({ oldSlugs: next }).commit();
        }
        original.onHandle?.();
      },
    };
  }
  return KeepOldSlugPublish;
}
