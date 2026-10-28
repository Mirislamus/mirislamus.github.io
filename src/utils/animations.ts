export const afterAnimations = async (animations: readonly Animation[], done: () => void) => {
  try {
    await Promise.all(animations.map(animation => animation.finished));
  } catch {}
  done();
};
