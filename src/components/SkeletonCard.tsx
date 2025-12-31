import { motion } from 'framer-motion';

const SkeletonCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card border border-border rounded-xl p-4 space-y-4"
    >
      {/* Image skeleton */}
      <div className="w-full h-48 bg-muted rounded-lg overflow-hidden relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear',
          }}
        />
      </div>
      
      {/* Badge skeleton */}
      <div className="w-20 h-5 bg-muted rounded-full overflow-hidden relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear',
            delay: 0.1,
          }}
        />
      </div>

      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-6 bg-muted rounded w-3/4 overflow-hidden relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'linear',
              delay: 0.2,
            }}
          />
        </div>
        <div className="h-4 bg-muted rounded w-1/2 overflow-hidden relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'linear',
              delay: 0.3,
            }}
          />
        </div>
      </div>

      {/* Description skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-full overflow-hidden relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'linear',
              delay: 0.4,
            }}
          />
        </div>
        <div className="h-4 bg-muted rounded w-5/6 overflow-hidden relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'linear',
              delay: 0.5,
            }}
          />
        </div>
      </div>

      {/* Button skeleton */}
      <div className="h-10 bg-muted rounded-lg w-32 overflow-hidden relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear',
            delay: 0.6,
          }}
        />
      </div>
    </motion.div>
  );
};

export default SkeletonCard;
