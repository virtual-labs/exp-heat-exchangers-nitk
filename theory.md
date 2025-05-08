## INTRODUCTION

#### User Objectives and Goals:

1. To determine the Log mean temperature difference.
2. To determine the overall heat transfer coefficient for the inside area.
3. To determine the effectiveness of the heat exchanger.

#### Theory

A heat exchanger is a system used to transfer heat between two fluids, one hot and one cold as shown in Fig. 1.

<center>

![alt text](images/1.png)

Fig 1. Schematic representation of a heat exchanger

</center>
Heat transfer from one fluid to another fluid is given by the expression,
<center>

$Q = A \times U \times (∆T)_m$

</center>

Where,
$(∆T)_m$ is the mean temperature difference  
$U$ is the overall heat transfer coefficient for the inside area  
$A$ is the inside area of the heat exchanger

Temperature Profiles for Parallel and Counter Flow Heat Exchangers

For which,

<center>

<!-- ![](images/3.png) -->

$(∆T)_m = \frac{θ_i - θ_o}{log(θ_i/θ_o)}$

</center>

<center>

![](images/7.png)

</center>

This expression for the mean temperature difference is known as the Log Mean Temperature Difference (LMTD).

<center>

<!-- ![](images/4.png) -->

$U = \frac{Q_{absorbed}}{(∆T)_m \times A}$

</center>

In order to make comparisons between various types of heat exchangers, the term Heat Exchanger Effectiveness is used, which is defined as:

<center>

<!-- ![](images/5.png) -->

$∈ = \frac{Actual \space heat \space transfer}{Maximum \space possible \space heat \space transfer}$

</center>

Actual heat transfer may be computed by calculating the energy lost by the hot fluid or the energy gained by the cold fluid as

$Q = C_h(T_{hi} - T_{ho})$ or $Q = C_c(T_{co} - T_{ci})$

<!-- Q = C<sub>h</sub> (T<sub>hi</sub>-T<sub>ho</sub> ) or Q= C<sub>c</sub> (T<sub>co</sub>-T<sub>ci</sub> ). -->

Both for parallel and counter flow heat exchanger where

$C_h = W_h C_{ph}$ and $C_c = W_c C_{pc}$

<!-- C<sub>h</sub>= W<sub>h</sub> C<sub>ph</sub> and C<sub>c</sub>= W<sub>c</sub> C<sub>pc</sub> -->

$W_h$ = mass of hot fluid flowing per unit time  
$W_c$ = mass of cold fluid flowing per unit time  
$C_{ph}$ and $C_{pc}$ are the specific heats of the hot and cold fluid respectively  
Maximum possible heat transfer is given by
$Q_{max}= C_{min} (T_{hi}-T_{ci} )$

Where $C_{min}$ is either $C_{ph}$ or $C_{pc}$, whichever is lesser.
Hence, effectiveness

<center>

<!-- ![](images/6.png) -->

$∈ = \frac{C_h(T_{hi}-T_{ho})}{C_{min}(T_{hi} - T_{ci})}$

$∈ = \frac{C_c(T_{co}-T_{ci})}{C_{min}(T_{hi} - T_{ci})}$

</center>

#### Equations/formulas:

Log Mean Temperature Difference (LMTD).

<!-- ![](images/3.png) -->
<!-- ![](images/4.png) -->

$(ΔT)_m = \frac{θ_i - θ_o}{log(θ_i/θ_o)}$ $U = \frac{Q_{absorbed}}{(ΔT)_m \times A}$

Effectiveness (ϵ)

$∈ = \frac{C_h(T_{hi}-T_{ho})}{C_{min}(T_{hi} - T_{ci})}$

$∈ = \frac{C_c(T_{co}-T_{ci})}{C_{min}(T_{hi} - T_{ci})}$
