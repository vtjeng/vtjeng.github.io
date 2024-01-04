---
layout: home
title-tag: "Vincent Tjeng"
permalink: /
# This description is what is used for SEO purposes.
description: Software engineer interested in machine learning robustness.
MathJax: True
---

<p style="text-align: center">
<img src="/assets/images/vincent-tjeng.jpg" width="200"/>
</p>

I am currently a software engineer at Google DeepMind. I work on enabling programmers to effectively deploy machine learning in large-scale production systems, with a focus on reducing engineering effort and scope for errors. (Technical details of the work are available [here](https://arxiv.org/pdf/2304.13033.pdf)). Outside of work, I also study robustness in machine learning. My hobbies include photography and making time-lapse videos, as well as hiking the United States' breathtaking network of national and state parks.

[Google Scholar](https://scholar.google.com/citations?user=GZt32DEAAAAJ) / [GitHub](https://github.com/vtjeng/) / [Twitter](https://twitter.com/VincentTjeng)
{: .main-links}

# Research

## Evaluating Robustness of Neural Networks with Mixed Integer Programming

**Vincent Tjeng**, [Kai Xiao](https://kaixiao.github.io/), [Russ Tedrake](https://groups.csail.mit.edu/locomotion/russt.html). _ICLR 2019_.
{: .byline}

[[Paper]](https://arxiv.org/abs/1711.07356)
[[Code]](https://github.com/vtjeng/MIPVerify.jl)
| [[MIT News]](https://news.mit.edu/2019/how-tell-whether-machine-learning-systems-are-robust-enough-real-worl-0510)
{: .byline-links}

This paper presents a complete verifier for piecewise-linear networks, with verification of the target property expressed as solving a mixed-integer program. We apply our verifier to the task of evaluating the robustness of neural networks to adversarial examples. As compared to previous approaches, we certify robustness for more samples _and_ find more adversarial examples than before. The improved scalability of our approach is based on novel, tight formulations for non-linearities in the mixed-integer program, which speed up optimization by several orders of magnitude.

## Training for Faster Adversarial Robustness Verification via Inducing ReLU Stability

[Kai Xiao](https://kaixiao.github.io/), **Vincent Tjeng**, Nur Muhammad (Mahi) Shafiullah, [Aleksander Madry](https://people.csail.mit.edu/madry/). _ICLR 2019_.
{: .byline}

[[Paper]](https://arxiv.org/abs/1809.03008)
[[Code]](https://github.com/MadryLab/relu_stable)
{: .byline-links}

This paper designs neural networks that are both robust and easily verifiable. We identify two key properties of neural networks (weight sparsity and ReLU stability) that make them more amenable to verification, and demonstrate regularization methods used during training to promote these properties without significantly reducing network accuracy. These techniques can be used in conjunction with any standard training procedure, and allow us to train provably robust networks for CIFAR-10.
