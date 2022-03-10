(ns bob.list-comprehensions)

(comment

  ;; Ziel
  ;; (lc [(* x x) for x in [1 2 3 4] where (> x 2)])

  ;; erst so, dann [result _for variable _in lis _where pred] form

  ;; Zuerst: nur die Liste zurückgeben

  (defmacro lc
    [form]
    (let [sym      (first form)
          variable (nth form 2)
          lis      (nth form 4)
          pred     (nth form 6)]
      `~lis)))


(comment
  ;; Ziel: mit Prädikat
  ;; (lc [x for x in [1 2 3 4] where (> x 2)])


  (defn make-pred-fn
    [sym pred]
    `(fn [~sym]
       ~pred))

  (defmacro lc
    [form]
    (let [[result _for variable _in lis _where pred] form]
      `(filter ~(make-pred-fn variable pred)
               ~lis))))

(defn make-pred-fn
  [sym pred]
  `(fn [~sym]
     ~pred))

(defn make-result-fn
  [result fn-form]
  `(fn [~result]
     ~fn-form))

(defmacro lc
  [form]
  (let [[result _for variable _in lis _where pred] form]
    `(map ~(make-result-fn variable result)
          (filter ~(make-pred-fn variable pred)
                  ~lis))))






















(lc [(* x x) for x in [1 2 3 4] where (> x 2)])
























;; Aber: "normaler Weg" sogar kürzer bzgl. Zeichen und für funktionale
;; Programmierinnen sehr gut lesbar
;; Deshalb oft: Solche Makros nicht nötig
;; Außer z. B. DSLs für "Fachfremde" o. ä.
(map #(* % %) (filter #(> % 2) [1 2 3 4]))

;; Zusatz ggf.: Argument Assertions
;;   (assert (= _for 'for) "'for' not found")
