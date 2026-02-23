program credential_registry.aleo {
    struct CredentialData {
        holder: address,
        created_at: u32,
        attribute_count: u8,
        is_active: bool,
    }

    mapping credential_commitments: field => CredentialData;

    @noupgrade
    async constructor() {}

    async transition register_commitment(public commitment: field, public count: u8) -> Future {
        return finalize_register_commitment(commitment, count, self.caller);
    }

    async function finalize_register_commitment(public commitment: field, public count: u8, public caller: address) {
        // SECURITY FIX: Prevent overwriting existing commitments
        assert(!Mapping::contains(credential_commitments, commitment));

        let data: CredentialData = CredentialData {
            holder: caller,
            created_at: block.height,
            attribute_count: count,
            is_active: true,
        };
        Mapping::set(credential_commitments, commitment, data);
    }

    async transition revoke_credential(public commitment: field) -> Future {
        return finalize_revoke_credential(commitment, self.caller);
    }

    async function finalize_revoke_credential(public commitment: field, public caller: address) {
        let data: CredentialData = Mapping::get(credential_commitments, commitment);
        assert_eq(data.holder, caller);

        let new_data: CredentialData = CredentialData {
            holder: data.holder,
            created_at: data.created_at,
            attribute_count: data.attribute_count,
            is_active: false,
        };
        Mapping::set(credential_commitments, commitment, new_data);
    }

    async transition verify_commitment(public commitment: field) -> Future {
        return finalize_verify_commitment(commitment);
    }

    async function finalize_verify_commitment(public commitment: field) {
        let data: CredentialData = Mapping::get(credential_commitments, commitment);
        assert(data.is_active);
    }
}
