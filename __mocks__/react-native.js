const RN = jest.requireActual('react-native');

RN.Animated.loop = (animation) => ({ start: () => {}, stop: () => {} });
RN.Animated.sequence = (animations) => ({ start: () => {}, stop: () => {} });
RN.Animated.timing = (value, config) => ({ start: () => {}, stop: () => {} });

module.exports = RN; 