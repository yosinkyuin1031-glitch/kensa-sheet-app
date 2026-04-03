-- =============================================
-- RLS有効化 + Policy設定テンプレート
-- =============================================

-- 1. RLS有効化
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cm_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hearing_responses ENABLE ROW LEVEL SECURITY;

-- 2. Policy設定（自院データのみ）
CREATE POLICY "clinic_patients_policy" ON patients
  FOR ALL USING ("clinicId" IN (
    SELECT clinic_id::text FROM clinic_members
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "clinic_visits_policy" ON patient_visits
  FOR ALL USING ("patientId" IN (
    SELECT id FROM patients WHERE "clinicId" IN (
      SELECT clinic_id::text FROM clinic_members
      WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "clinic_prices_policy" ON clinic_prices
  FOR ALL USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid()
  ));

-- 3. Policy設定（認証ユーザーのみ）
CREATE POLICY "authenticated_users_only" ON customers
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_users_only" ON cm_health_logs
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "authenticated_users_only" ON hearing_responses
  FOR ALL USING (auth.uid() IS NOT NULL);
