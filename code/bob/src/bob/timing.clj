(ns bob.timing)

(defn do-something
  []
  (mapv inc (range 20000000))
  "finished")

(let [before (System/currentTimeMillis)
      result (do-something)
      after  (System/currentTimeMillis)]
  (println "Needed: " (- after before) " ms.")
  result)


(defmacro timing [form]
  `(let [before# (System/currentTimeMillis)
         result#  ~form
         after#  (System/currentTimeMillis)]
     (println "Needed: " (- after# before#) " ms.")
     result#))

(timing (do-something))
