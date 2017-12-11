BayesLikelihood <- function(x, mu, variance, prior) {
	predProb <- sapply(x, dnorm, mean=mu, sd = sqrt(variance))
	return(prod(predProb)*prior)
}

BayesPosterior <- function(x, mu, variance, prior) {
	numerator <- BayesLikelihood(x, mu[2], variance[2], prior[2])
	denominator <- BayesLikelihood(x, mu[2], variance[2], prior[2]) + BayesLikelihood(x, mu[1], variance[1], prior[1])

	return(numerator/denominator)
}

mu <- c(0,0)
variance <- c(1,16)
prior <- c(0.5,0.5)
BayesPosterior(c(1,2), mu, variance, prior)

xvec <- expand.grid(.25*(-20:20),.25*(-20:20))

f1 <- matrix(apply(xvec,1,BayesPosterior, mu=mu, variance = variance, prior = prior), nrow = 41)

contour(f1)
