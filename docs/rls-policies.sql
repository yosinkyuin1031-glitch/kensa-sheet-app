-- =====================================================
-- 検査シート作成アプリ RLS（Row Level Security）ポリシー
-- Supabase SQL Editorで実行してください
-- =====================================================

-- 1. RLSを有効化（まだ有効でない場合）
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ks_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ks_examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_selfcare_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_protocols ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ヘルパー関数: 現在のユーザーのclinic_idを取得
-- =====================================================
CREATE OR REPLACE FUNCTION get_my_clinic_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT clinic_id
  FROM clinic_members
  WHERE user_id = auth.uid()
    AND is_active = true
  LIMIT 1;
$$;

-- =====================================================
-- clinics テーブル
-- =====================================================
-- 自分が所属する院のみ参照可能
DROP POLICY IF EXISTS "clinics_select_own" ON clinics;
CREATE POLICY "clinics_select_own" ON clinics
  FOR SELECT USING (id = get_my_clinic_id());

-- 新規登録時のINSERTは認証ユーザーなら許可（signup時に使用）
DROP POLICY IF EXISTS "clinics_insert_auth" ON clinics;
CREATE POLICY "clinics_insert_auth" ON clinics
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 自分の院のみ更新可能
DROP POLICY IF EXISTS "clinics_update_own" ON clinics;
CREATE POLICY "clinics_update_own" ON clinics
  FOR UPDATE USING (id = get_my_clinic_id());

-- =====================================================
-- clinic_members テーブル
-- =====================================================
-- 自分の院のメンバーのみ参照可能
DROP POLICY IF EXISTS "members_select_own_clinic" ON clinic_members;
CREATE POLICY "members_select_own_clinic" ON clinic_members
  FOR SELECT USING (
    clinic_id = get_my_clinic_id()
    OR user_id = auth.uid()
  );

-- 新規登録時のINSERT（signup時に使用）
DROP POLICY IF EXISTS "members_insert_auth" ON clinic_members;
CREATE POLICY "members_insert_auth" ON clinic_members
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- ks_patients テーブル
-- =====================================================
DROP POLICY IF EXISTS "patients_select_own_clinic" ON ks_patients;
CREATE POLICY "patients_select_own_clinic" ON ks_patients
  FOR SELECT USING (clinic_id = get_my_clinic_id());

DROP POLICY IF EXISTS "patients_insert_own_clinic" ON ks_patients;
CREATE POLICY "patients_insert_own_clinic" ON ks_patients
  FOR INSERT WITH CHECK (clinic_id = get_my_clinic_id());

DROP POLICY IF EXISTS "patients_update_own_clinic" ON ks_patients;
CREATE POLICY "patients_update_own_clinic" ON ks_patients
  FOR UPDATE USING (clinic_id = get_my_clinic_id());

DROP POLICY IF EXISTS "patients_delete_own_clinic" ON ks_patients;
CREATE POLICY "patients_delete_own_clinic" ON ks_patients
  FOR DELETE USING (clinic_id = get_my_clinic_id());

-- =====================================================
-- ks_examinations テーブル
-- =====================================================
DROP POLICY IF EXISTS "exams_select_own_clinic" ON ks_examinations;
CREATE POLICY "exams_select_own_clinic" ON ks_examinations
  FOR SELECT USING (clinic_id = get_my_clinic_id());

DROP POLICY IF EXISTS "exams_insert_own_clinic" ON ks_examinations;
CREATE POLICY "exams_insert_own_clinic" ON ks_examinations
  FOR INSERT WITH CHECK (clinic_id = get_my_clinic_id());

DROP POLICY IF EXISTS "exams_update_own_clinic" ON ks_examinations;
CREATE POLICY "exams_update_own_clinic" ON ks_examinations
  FOR UPDATE USING (clinic_id = get_my_clinic_id());

DROP POLICY IF EXISTS "exams_delete_own_clinic" ON ks_examinations;
CREATE POLICY "exams_delete_own_clinic" ON ks_examinations
  FOR DELETE USING (clinic_id = get_my_clinic_id());

-- =====================================================
-- custom_selfcare_items テーブル
-- =====================================================
DROP POLICY IF EXISTS "selfcare_select_own_clinic" ON custom_selfcare_items;
CREATE POLICY "selfcare_select_own_clinic" ON custom_selfcare_items
  FOR SELECT USING (clinic_id = get_my_clinic_id());

DROP POLICY IF EXISTS "selfcare_insert_own_clinic" ON custom_selfcare_items;
CREATE POLICY "selfcare_insert_own_clinic" ON custom_selfcare_items
  FOR INSERT WITH CHECK (clinic_id = get_my_clinic_id());

DROP POLICY IF EXISTS "selfcare_update_own_clinic" ON custom_selfcare_items;
CREATE POLICY "selfcare_update_own_clinic" ON custom_selfcare_items
  FOR UPDATE USING (clinic_id = get_my_clinic_id());

DROP POLICY IF EXISTS "selfcare_delete_own_clinic" ON custom_selfcare_items;
CREATE POLICY "selfcare_delete_own_clinic" ON custom_selfcare_items
  FOR DELETE USING (clinic_id = get_my_clinic_id());

-- =====================================================
-- custom_protocols テーブル
-- =====================================================
DROP POLICY IF EXISTS "protocols_select_own_clinic" ON custom_protocols;
CREATE POLICY "protocols_select_own_clinic" ON custom_protocols
  FOR SELECT USING (clinic_id = get_my_clinic_id());

DROP POLICY IF EXISTS "protocols_insert_own_clinic" ON custom_protocols;
CREATE POLICY "protocols_insert_own_clinic" ON custom_protocols
  FOR INSERT WITH CHECK (clinic_id = get_my_clinic_id());

DROP POLICY IF EXISTS "protocols_update_own_clinic" ON custom_protocols;
CREATE POLICY "protocols_update_own_clinic" ON custom_protocols
  FOR UPDATE USING (clinic_id = get_my_clinic_id());

DROP POLICY IF EXISTS "protocols_delete_own_clinic" ON custom_protocols;
CREATE POLICY "protocols_delete_own_clinic" ON custom_protocols
  FOR DELETE USING (clinic_id = get_my_clinic_id());
