import { motion } from 'framer-motion';

const variants = {
  initial: {
    opacity: 0,
    y: 10,
    filter: 'blur(5px)'
  },
  enter: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.33, 1, 0.68, 1],
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: 'blur(5px)',
    transition: {
      duration: 0.4,
      ease: [0.33, 1, 0.68, 1]
    }
  }
};

export default function PageWrapper({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}
